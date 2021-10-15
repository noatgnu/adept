export class Settings {
  uniqueID: string = ""
  starterFileColumns: string[] = []
  primaryIDColumns: string[] = []
  experiments: Experiment[] = []
  blockMap: any = {}
}

export interface Experiment {
  name: string;
  condition: string;
}

export interface Block {
  id: number;
  title?: string;
  completed?: boolean;
  active?: boolean;
  data?: string;
}
