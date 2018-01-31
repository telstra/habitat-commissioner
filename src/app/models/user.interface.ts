// User

export interface UserInterface {
  username: string;
  apiBasicAuthCredentials: string;
  config: {
    orgs: string[];
    repoParentDirectory: string;
    apiHostName: string;
    ssl: {
      enable: boolean;
      passphrase: string;
      key: string;
      cert: string;
    },
    proxy: {
      enable: boolean,
      username: string,
      password: string,
      scheme: string,
      host: string,
      port: string
    },
    tests: [{
      id: string;
      name: string;
    }]
  }
}