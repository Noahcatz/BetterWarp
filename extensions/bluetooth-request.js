(async function(Scratch) {
  
  const vm = Scratch.vm;
  if(!Scratch.extensions.unsandboxed) {
    throw new Error('The Bluetooth API Extension requires to be unsandboxed. Sorry!')
  }
  
  if(!navigator.bluetooth) {
    alert('Bluetooth isn\'t supported in your device. Sorry!');
    throw new Error('Bluetooth isn\'t supported in your device. Sorry!')
  }
  
  let btDevice;
  let btServer;
  
  class BluetoothAPI {
    constructor() {
    }
    getInfo() {
      return {
        id: 'lemonBluetooth',
        name: Scratch.translate('Bluetooth Request'),
        color1: '#FF4C4C',
        color2: '#E03A2B',
        blocks: [
          {
            opcode: 'request',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('request bluetooth connection')
          },
          {
            opcode: 'connect',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('connect to device [DEVICE]'),
            arguments: {
              DEVICE: {
                type: Scratch.ArgumentType.STRING
              }
            }
          },
          {
            opcode: 'deviceSelected',
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate('selected device')
          },
          {
            opcode: 'connectedServer',
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate('connected server')
          },
        ]
      };
    }
  
    async request() {
      try {
        const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }]})
        btDevice = device;
      } catch (error) {
        throw new Error(`Uh oh! Something went wrong. ${error}`);
      }
    }
    async deviceSelected() {
      return JSON.stringify(btDevice);
    }
    async connect(args) {
      const device = args.DEVICE;
      try {
        const server = await device.gatt.connect();
        btServer = server;
      } catch (error) {
        throw new Error(`Uh oh! Something went wrong. ${error}`);
      }
    }
    async connectedServer() {
      return JSON.stringify(btServer);
    }
  }

Scratch.extensions.register(new BluetoothAPI());})(Scratch)
