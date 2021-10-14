import ufo from "@/assets/svg/icons/ufo.svg?raw";
import eyeClosed from "~/assets/svg/icons/eyeclosed.svg?raw";

export default () => ({
  SEO: {
    title: "",
    description: "",
    image: "",
    type: ""
  },
  audioPlaying: {},
  svgIcons: {
    ufo: ufo,
    eyeClosed: eyeClosed
  },
  pageInContainer : true,
  pageBackground : true,
  pageBreadCrumb: true,
  pageFocused: false,
  hideMenus: false,
  menuUsuario: false,
  breadcrumbs: {
    "/": {
      icon: "fas fa-home"
    },
    "/recursos": {
      name: "Recursos",
      icon: "fas fa-tree",
      description: "Documentos, libros, audios y recursos en general"
    },
    "/biblioteca": {
      name: "Biblioteca",
      icon: "fas fa-book-open",
      description: "Todos los documentos, comunicados, vídeos, audios, etc.",
      parent: "/recursos"
    },
    "/libros": {
      name: "Libros",
      icon: "fas fa-book",
      description: "Libros de descarga gratuita",
      parent: "/biblioteca"
    },
    "/audios": {
      name: "Audios",
      icon: "fas fa-music",
      description:
        "Meditaciones guiadas, talleres, cuentos, reflexiones, música...",
      parent: "/biblioteca"
    },
    "/videos": {
      name: "Vídeos",
      icon: "fab fa-youtube",
      description: "Vídeos de nuestro canal de Youtube",
      parent: "/recursos"
    },
    "/cuadernos": {
      name: "Cuadernos",
      icon: "far fa-clipboard",
      description:
        "Cuadernos de trabajo con meditaciones transcritas y otros materiales prácticos",
      parent: "/biblioteca"
    },
    "/redes": {
      name: "Redes Sociales",
      icon: "fab fa-facebook",
      description: "Tseyor en redes sociales",
      parent: "/recursos"
    },
    "/radio": {
      name: "Radio Tseyor",
      icon: "fas fa-broadcast-tower",
      description:
        "Radio Online con comunicados y otros programas funcionando 24/7",
      parent: "/recursos"
    },
    "/archivos": {
      name: "Archivos",
      icon: "fas fa-folder-open",
      description: "Zona de archivos para descargar",
      parent: "/recursos"
    },
    "/centros": {
      name: "Centros Tseyor",
      icon: "fas fa-globe-americas",
      description: "Lugares Tseyor en el mundo",
      parent: "/recursos"
    },
    "/recursos/listados": {
      name: "Listados de miembros",
      icon: "fas fa-users",
      description: "Listado de miembros de Tseyor"
    },
    /*
    "/recursos/estatutos": {
      name: "Estatutos",
      icon: "fas fa-scroll",
      description:
        "Estatutos de las instituciones de Tseyor: ONG, Universidad y la Asociación Tseyor"
    }, */
    "/normativas": {
      name: "Normativas",
      icon: "fas fa-balance-scale",
      description: "Normativas, estatutos, protocolos de funcionamiento",
      parent: "/recursos"
    },
    "/legal": {
      name: "Legal",
      icon: "fas fa-gavel",
      description: "Documentos legales"
    },
    "/reuniones": {
      name: "Archivo de Reuniones",
      icon: "fas fa-file-signature",
      description: "Actas y anexos de nuestras reuniones",
      parent: "/recursos"
    },
    
    "/usuarios": {
      name: "Usuarios",
      icon: "fas fa-users",
      description: 'Usuarios de Tseyor',
      parent: "/recursos"
    },

    "/actividades": {
      name: "Actividades",
      icon: "fas fa-walking",
      description: "Actividades de la comunidad Tseyor",
    },
    "/actividades/guia": {
      name: "Mis primeros pasos en Tseyor",
      icon: "fas fa-map-signs",
      description: "Guía para nuevos miembros de Tseyor",
      parent: "/actividades"
    },
    "/actividades": {
      icon: "fas fa-walking",
      name: "Actividades",
      description: "Agenda de actividades: reuniones, eventos...",
    },
    "/agenda": {
      name: "Agenda de Actividades",
      icon: "far fa-calendar-alt",
      description: "Calendario de actividades",
      parent: "/actividades"
    },

    "/eventos": {
      name: "Eventos",
      icon: "fas fa-calendar-week",
      description: "Sigue el calendario de nuestros eventos y suscríbete",
      parent: "/actividades"
    },


    "/equipos": {
      name: "Equipos",
      icon: "fas fa-people-carry",
      description: "Listado de todos los equipos de Tseyor",
      parent: "/actividades"
    },

    "/biblioteca/comunicados": {
      name: "Archivo de Comunicados",
      icon: "svg ufo",
      description: "Archivo con todos los comunicados transcritos y en audio"
    },
    "/meditar": {
      name: "Meditar",
      icon: "svg eyeClosed",
      description: "Espacio para la meditación",
      parent: "/actividades"
    },
    "/meditar/guia": {
      name: "Guía para la Meditación",
      icon: "fas fa-question-circle",
      description: "Aprende a meditar con esta sencilla guía"
    },
    "/meditar/sello": {
      name: "Taller de Mente en Blanco",
      icon: "fas fa-circle",
      description:
        "Puedes visualizar el sello de Tseyor para dejar la mente en blanco"
    },

    "/leer": {
      name: "Lectura",
      icon: "fas fa-book",
      description: "Lee las palabras que provienen de las estrellas",
      parent: "/actividades"
    },
    "/telegram-whatsapp": {
      name: "Grupos Telegram/Whatsapp",
      icon: "fab fa-telegram",
      description: "Listado de grupos y canales Telegram/Whatsapp",
      parent: "/actividades"
    },
    "/muul": {
      name: "Zona Muul",
      icon: "fas fa-user-astronaut",
      description: "Zona para miembros Muul-Águila GTI de Tseyor",
      parent: "/actividades"
    },
    "/formularios/experiencias": {
      name: "Formulario de experiencias",
      icon: "fas fa-edit",
      description: "Comparte tu experiencia de sueños y extrapolaciones",
      parent: "/actividades"
    },

    "/novedades": {
      name: "Novedades",
      icon: "fas fa-bolt",
      description: "Consulta y/o suscríbete a todas las novedades de Tseyor"
    },



    "/publicaciones": {
      name: "Publicaciones",
      icon: "fas fa-newspaper",
      description: "Noticias, artículos y otros contenidos públicos",
    },
    "/noticias": {
      name: "Noticias",
      icon: "fas fa-bullhorn",
      description: "Noticias acerca de la comunidad Tseyor en el mundo",
      parent: "/publicaciones"
    },
    "/comunicados": {
      name: "Comunicados",
      icon: "svg ufo",
      description: "Últimos comunicados de nuestros Guías Estelares",
      parent: "/publicaciones"
    },

    "/blogs": {
      name: "Blogs",
      icon: "fab fa-blogger",
      description: "Blogs de Tseyor",
      parent: "/publicaciones"
    },
    "/entradas": {
      name: "Entradas",
      icon: "fas fa-pen-alt",
      description: "Artículos de interés de nuestras actividades",
      parent: "/blogs"
    },
    "/boletines": {
      name: "Boletines",
      icon: "fas fa-rss",
      description: "Suscríbete a nuestros boletines",
      parent: "/publicaciones"
    },

    "/presentacion": {
      name: "Quienes Somos",
      icon: "fas fa-question",
      description: "Descubre Tseyor"
    },
    "/presentacion/visita": {
      name: "Visita Guiada",
      icon: "fas fa-route",
      description: "Visita guiada para conocer Tseyor",
    },
    "/presentacion/origenes": {
      name: "Orígenes de Tseyor",
      icon: "fas fa-fast-backward",
      description: "Orígenes del grupo Tseyor",
      parent: "/presentacion/visita"
    },
    "/guias-estelares": {
      name: "Guías Estelares",
      icon: "svg ufo",
      description: "Toda la información de nuestros tutores de la Confederación de Mundos",
      parent: "/presentacion"
    },
    "/preguntas_frecuentes": {
      name: "Preguntas Frecuentes",
      icon: "fas fa-question-circle",
      description: "Listado de preguntas habituales con su respuesta",
      parent: "/presentacion"
    },
    "/mapa": {
      name: "¿Dónde Estamos?",
      icon: "fas fa-globe-americas",
      description: "Tseyor en todo el mundo",
      parent: "/presentacion"
    },
    "/cursos": {
      name: "Curso Holístico",
      icon: "fas fa-graduation-cap",
      description:
        "Curso completo para entender todo el proceso filosófico y organizativo de Tseyor",
      parent: "/presentacion"
    },
    "/organizacion": {
      name: "Organización",
      icon: "fas fa-sitemap",
      description: "Organigrama de todos los estamentos de Tseyor",
    },

    "/ong": {
      name: "ONG Mundo Armónico Tseyor",
      icon: "fas fa-hands-helping",
      description: "Nuestra ONG para la Ayuda humanitaria",
      parent: "/organizacion"
    },
    "/asociacion": {
      name: "Centro de Estudios Socioculturales",
      icon: "fas fa-chess-rook",
      description: "Asociación formativa inicial de Tseyor y estatutos",
      parent: "/organizacion"
    },
    "/universidad": {
      name: "Universidad",
      icon: "fas fa-university",
      description: "Información y departamentos de la Universidad Tseyor de Granada",
      parent: "/organizacion"
    },
    "/equipos/comision": {
      name: "Comisión de Tseyor",
      icon: "fas fa-play-circle fa-rotate-270",
      description: "La Comisión de Tseyor es la Consciencia de Tseyor",
      parent: "/equipos"
    },
    "/comision": {
      name: "Comisión de Tseyor",
      icon: "fas fa-play-circle fa-rotate-270",
      description: "La Comisión de Tseyor es la Consciencia de Tseyor",
      parent: "/organizacion"
    },
    "/agora": {
      name: "Ágora del Junantal",
      icon: "fas fa-users",
      description: "Asamblea soberana de Tseyor",
      parent: "/organizacion"
    },

    "/donar": {
      name: "Donar",
      icon: "fas fa-donate",
      description: "Colabora aportando tu granito de arena",
      parent: "/ong"
    },
    "/muular": {
      name: "Muular Electrónico",
      icon: "fas fa-exchange-alt",
      description: "Aplicación del Muular Electrónico",
      parent: "/ong"
    },

    "/ayuda": {
      name: "Ayuda",
      icon: "fas fa-question-circle",
      description: "Sección de ayuda y consultas"
    },
    "/contactar": {
      name: "Contactar",
      icon: "fas fa-envelope-open-text",
      description: "Contacta con nosotros para cualquier consulta",
      parent: "/ayuda"
    },
    "/contactos": {
      name: "Buscar alguien cercano",
      icon: "fas fa-map-marked-alt",
      description: "Busca un miembro de Tseyor en tu zona",
      parent: "/ayuda"
    },
    "/pulsar": {
      icon: "fas fa-briefcase-medical",
      name: "Púlsar Sanador",
      description: "Pide sanación al Púlsar Sanador de Tseyor",
      parent: "/ayuda"
    },
    "/paltalk": {
      icon: "fas fa-chalkboard-teacher",
      name: "Tutoriales de Paltalk",
      description: "Vídeos de ayuda para aprender a usar paltalk",
      parent: "/ayuda"
    },

    "/buscar": {
      name: "Buscar",
      icon: "fas fa-search"
    }
  }
});
