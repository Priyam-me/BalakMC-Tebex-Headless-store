import config from '../app.config.js';

export function getPublicConfig() {
  return config.public;
}

export function getPrivateConfig() {
  return config.private;
}

export function getFullConfig() {
  return config;
}
