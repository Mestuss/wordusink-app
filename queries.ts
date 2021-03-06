import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation signUp($email: String!) {
    signUp(email: $email) {
      type
      message
      token
    }
  }
`;

export const ALL_WORDS = gql`
  {
    allWords {
      id
      name
      caption
      examples
      votes {
        id
      }
      image {
        id
        url
      }
    }
  }
`;

export const SPECIFIC_WORDS = gql`
  query specificWords($alphabet: String!) {
    specificWords(alphabet: $alphabet) {
      id
      name
      caption
      examples
      image {
        url
      }
      votes {
        id
      }
    }
  }
`;

export const HAVING_WORDS = gql`
  {
    havingWords {
      name
      count
    }
  }
`;

export const ALL_IMAGES = gql`
  {
    allImages {
      id
      url
    }
  }
`;

export const EDIT_WORD = gql`
  mutation editWord(
    $wordId: String!
    $name: String
    $caption: String
    $url: String
    $examples: [String]!
  ) {
    editWord(
      wordId: $wordId
      name: $name
      caption: $caption
      url: $url
      examples: $examples
    )
  }
`;

export const DELETE_WORD = gql`
  mutation deleteWord($wordId: String!) {
    deleteWord(wordId: $wordId)
  }
`;

export const SELF_PROFILE = gql`
  {
    self {
      id
      userName
      email
      avatar
      isSelf
      images {
        id
        url
      }
      onTodayWords {
        id
      }
    }
  }
`;

export const CREATE_WORD = gql`
  mutation createWord(
    $name: String!
    $caption: String!
    $url: String
    $examples: [String]!
  ) {
    createWord(name: $name, caption: $caption, url: $url, examples: $examples) {
      result
      message
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation editProfile($userName: String!, $avatar: String) {
    editProfile(userName: $userName, avatar: $avatar)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($email: String!) {
    deleteUser(email: $email)
  }
`;
