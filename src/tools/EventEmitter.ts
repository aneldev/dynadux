export class EventEmitter {
  private callBacks: Array<((...args: any[]) => void)> = [];

  public trigger = (...args: any[]): void => {
    this.callBacks.forEach(cb => cb(...args));
  };

  public addEventListener = (callback: (...args: any[]) => void): void => {
    this.callBacks.push(callback);
  };
  public removeEventListener = (callback: (...args: any[]) => void): void => {
    this.callBacks = this.callBacks.filter(c => c !== callback);
  };
}
