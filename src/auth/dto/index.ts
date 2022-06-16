export class AccessTokenDto {
  'sub': string;
  'aud': string;
  'scope': string[];
  'amr': string[];
  'iss': string;
  'preferred_username': string;
  'exp': number;
  'iat': number;
  'jti': string;
}

export class IdTokenDto {
  'sub': string;
  'email_verified': string;
  'amr': string[];
  'profile': string;
  'kid': string;
  'iss': string;
  'phone_number_verified': string;
  'preferred_username': string;
  'nonce': string;
  'picture': string;
  'aud': string;
  'auth_time': number;
  'scope': string[];
  'name': string;
  'phone_number': string;
  'exp': number;
  'iat': number;
  'jti': string;
  'email': string;
}
