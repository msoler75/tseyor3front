import Vue from 'vue'
import loadImage from "blueimp-load-image";

const populateCarpetaPermisos = {
  propietario: '*',
  lecturaUsuarios: '*',
  lecturaGrupos: '*',
  lecturaEquipos: '*',
  escrituraUsuarios: '*',
  escrituraGrupos: '*',
  escrituraEquipos: '*',
  administracionUsuarios: '*',
}

const populateArchivoPermisos = {
  propietario: '*',
}

const populateArchivo = {
  media: "*",
  ...populateArchivoPermisos
}

const populateCarpeta = {
  ...populateCarpetaPermisos,
  padre: {
    populate: {
      subcarpetas: '*',
      archivos: '*',
      ...populateCarpetaPermisos
    }
  },
  subcarpetas: {
    populate: {
      subcarpetas: '*',
      archivos: '*',
      ...populateCarpetaPermisos
    }
  },
  archivos: {
    populate: populateArchivo
  }  
}


const tengoPermiso = (carpeta, user, modo) => {
  // console.warn("tengopermisos?", carpeta.ruta, user?user.username:null, modo);
  //console.log("carpeta", carpeta);
  //console.log("user", user);
  if (!modo) return false;
  if (!carpeta) return false;
  if (!("lecturaUsuarios" in carpeta)) return false;

  if (soyPropietario(carpeta, user)) return true;

  if (carpeta.soloSuperAdmin) return false;

  if (modo == "lectura" && tengoPermiso(carpeta, user, "escritura")) return true;
  if (modo == "escritura" && tengoPermiso(carpeta, user, "administracion"))
    return true;

  var acceso = modo == "escritura" ? carpeta.escrituraAcceso : "Nadie";

  if (acceso === "Todos") return true;
  if (!user || !user.id) return false;
  if (acceso === "Autenticados") return true;

  const rol = user.role.name;
  if (acceso === "Delegados" && rol.match(/elegado/)) return true;
  if (acceso === "Muul" && rol.match(/uul/)) return true;

  if (((modo + "Usuarios") in carpeta) && carpeta[modo + "Usuarios"].find((x) => x.id === user.id))
    return true;

  if (modo != "administracion") {
    if ('grupos' in user && ((modo + "Grupos") in carpeta))
      for (const g of carpeta[modo + "Grupos"]) {
        if (user.grupos.find((x) => x.id === g.id)) {
          return true;
        }
      }
    if ('equipos' in user && ((modo + "Equipos") in carpeta))
      for (const e of carpeta[modo + "Equipos"]) {
        if (user.equipos.find((x) => x.id === e.id)) {
          return true;
        }
      }
  }
  return false;
}

const soyPropietario = (carpeta, user) => {
  if (!carpeta) return false;
  if (
    !user ||
    !user.id ||
    !("propietario" in carpeta) ||
    !carpeta.propietario
  )
    return false;
  const aid = carpeta.propietario.id;
  return aid === user.id || parseInt(aid) === user.id;
}


const uploadFiles = async (carpeta, files, $strapi, $toast) => {

  const formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    const file = files[i];
    let media = {
      url: null,
      size: file.size / 1024,
    };
    // es imagen?
    if (file.name.match(/\.(png|webp|svg|jpe?g)$/i)) {
      let src = await new Promise((success) => {
        loadImage(
          file,
          function (canvas) {
            console.log("IMG", canvas);
            success(canvas.toDataURL());
          }, {
            maxWidth: 600,
            maxHeight: 300,
            minWidth: 100,
            minHeight: 50,
            canvas: true,
          } // Options
        );
      });
      /*src = await new Promise((success) => {
          var reader = new FileReader();
          reader.addEventListener("load", function () {
              success(this.result);
          }, false);
          reader.readAsDataURL(file);
      })*/
      media = {
        url: src,
        size: file.size / 1024,
      };
    }

    if ("archivos" in carpeta) {
      const a = {
        id: 0,        
        nombre: file.name,
        uploading: true,
        carpeta: carpeta.id,
        media,
      }
      console.log('subiendo', a)
      carpeta.archivos.push(a);
    }
    formData.append("files", file);
  }

  const toastId = $toast("Subiendo archivos... 0%", {
    timeout: 99999999,
    pauseOnHover: false,
    closeOnClick: false,
    draggable: false,
    showCloseButtonOnHover: false,
    closeButton: false,
    icon: false,
  });

  $strapi
    .upload(formData, (e) => {
      let percent_completed = Math.round((e.loaded / e.total) * 100);
      console.log(percent_completed);
      //dataObj.max=e.total
      //dataObj.value=e.loaded
      $toast.update(toastId, {
        content: `Subiendo archivos... ${percent_completed}%`,
      });
    })
    .then((res) => {
      $toast.update(toastId, {
        content: "¡Completado!",
        options: {
          timeout: 1000,
        },
      });
      for (const file of res) {
        $strapi
          .create(
            "archivos", {
              nombre: file.name,
              carpeta: carpeta.id,
              media: file.id,
            }, {
              populate: populateArchivo,
            }
          )
          .then((res) => {
            console.warn("ARCHIVO RES", res);
            if (res.data && "archivos" in carpeta) {
              const a = carpeta.archivos.find(
                (x) => x.uploading && x.nombre == file.name
              );
              console.log('subido archivo', a, res.data)
              if (a) {
                a.id=res.data.id
                a.publishedAt = res.data.publishedAt
                Vue.set(a, 'propietario', res.data.propietario)
                Vue.set(a, 'padre', res.data.padre)
                a.uploading= false
              }
            }
          });
      }
    });
}

export {
  populateCarpeta,
  populateArchivo,
  populateCarpetaPermisos,
  populateArchivoPermisos,
  tengoPermiso,
  soyPropietario,
  uploadFiles
}
