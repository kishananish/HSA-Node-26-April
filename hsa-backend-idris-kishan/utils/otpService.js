import speakeasy from 'speakeasy';
import config from '../config/config';

const otpConfig = config.OTP;
const secret = speakeasy.generateSecret({ length: 20 });

export const generateOtp = () => {
  console.log('generateOtp secret ==>', secret);
  return speakeasy.totp({
    secret: 'GZASGJCRHF2G6KBRIU3CKQJDKBAX23ST',
    encoding: 'base32',
    digits: otpConfig.digits,
    step: otpConfig.step
  });
};

export const verifyOtp = otp => {
  console.log('verifyOtp secret ==>', secret);

  return speakeasy.totp.verify({
    secret: 'GZASGJCRHF2G6KBRIU3CKQJDKBAX23ST',
    encoding: 'base32',
    token: otp,
    digits: 4,
    step: 240
  });
};
