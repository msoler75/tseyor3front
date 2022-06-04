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

const populateCarpeta = {
  padre: "*",
  archivos: {
    populate: {
      media: "*",
      ...populateCarpetaPermisos
    },
  },
  subcarpetas: {
    populate: populateCarpetaPermisos
  },
  ...populateCarpetaPermisos
}

module.exports = {
  populateCarpeta,
  populateCarpetaPermisos
}
