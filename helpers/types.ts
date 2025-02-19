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
  tailscale: {
    website: string | null,
    public_ip: string | null
  };
  deviceName: string;
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
    }
    sumi: {
      enabled: boolean,
      config: object | null
    }
  }
};
