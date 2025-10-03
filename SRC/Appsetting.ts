export const ENVIRONMENT = {
  DEVELOPMENT_V1: "dev-v1",
  DEVELOPMENT: 'dev',
  STAGING: 'stag',
  PRODUCTION: 'prod'
}

export const CURRENT_ENV = ENVIRONMENT.DEVELOPMENT // prod ENVIRONMENT.DEVELOPMENT staging


let BASE_URL = ''

switch (CURRENT_ENV) {
  case ENVIRONMENT.STAGING:
    BASE_URL = ""
    break
  case ENVIRONMENT.PRODUCTION:
    BASE_URL = ""
    break
  case ENVIRONMENT.DEVELOPMENT_V1:
    BASE_URL = ""
    break
  default:
    // BASE_URL = "https://484d-2402-e280-4119-422-e1e9-1c3-b4ce-7e80.ngrok-free.app/"
    //  BASE_URL = "http://nodeapi.augmentedresourcing.com:3000/"
    // BASE_URL = "https://nodeapi.augmentedresourcing.com/"
       //BASE_URL = "http://192.168.1.14:3000/"
       BASE_URL = "https://smarttalent.augmentedresourcing.com/"            
}

export function getBaseUrl(): string {
  return BASE_URL
}

export function getDebugState(): boolean {
  return CURRENT_ENV !== 'prod'
}

