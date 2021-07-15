import { gql } from 'graphql-tag'

export const noticiasQuery = gql`
query NoticiasQuery {
    noticias {
      publicable {
        NombreTitulo,
        CuerpoTextoDescripcion
      }
    }
  }
  `
