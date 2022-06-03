const populateCarpeta = {
  padre: "*",
  archivos: {
    populate: ["media"],
  },
  subcarpetas: "*",
  propietario: "*",
  lecturaUsuarios: "*",
  lecturaGrupos: "*",
  lecturaEquipos: "*",
  escrituraUsuarios: "*",
  escrituraGrupos: "*",
  escrituraEquipos: "*",
  administracionUsuarios: "*",
}


const populateCarpetaPermisos = {
  propietario: "*",
  lecturaUsuarios: "*",
  lecturaGrupos: "*",
  lecturaEquipos: "*",
  escrituraUsuarios: "*",
  escrituraGrupos: "*",
  escrituraEquipos: "*",
  administracionUsuarios: "*"
}

module.exports = {
  populateCarpeta,
  populateCarpetaPermisos
}
