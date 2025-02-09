// FORMS

export type LoginFormType = {
  email: string;
  password: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type DeviceIdFormType = {
  id: string;
};


export type ConfigFormType = {
  deviceName: string;
  vpnConfig: {
    privateKey: string;
    publicKey: string;
    presharedKey: string;
    endpoint: string;
    allowedIPs: string;
    dns: string;
    persistentKeepalive: number;
  },
  systemConfig: {
    firstRun: boolean,
    passwordHash: string,
    wireGuardConfigPath: string
  },
  networkConfig: {
    ipAddress: string,
    gateway: string,
    dns: [string],
    interfaces: [{
      name: string,
      type: string,
      method: string,
      ssid?: string
      password?: string
      provider?: string
    }]
  },
  simConfig: {
    pin: string
  },
  services: {
    virtualHere: {
      enabled: boolean,
      port: number,
      config: object | null
    },
    wireGuard: {
      enabled: boolean,
      config: object | null
    },
    sumi: {
      enabled: boolean,
      config: object | null
    }
  }
};
