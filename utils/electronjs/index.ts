export const sendToElectron = (channel: any, data?: any) => {
    if ((window as any).api) {
        (window as any).api.send(channel, data ?? null);
    }
};

export const receiveFromElectron = (channel: any, callback: any) => {
    if ((window as any).api) {
        (window as any).api.receive(channel, callback);
    }
};
