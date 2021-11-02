export class Settings {
  uniqueID: string = ""
  starterFileColumns: string[] = []
  primaryIDColumns: string[] = []
  experiments: Experiment[] = []
  blockMap: any = {}
  blocks: Block[] = []
}

export interface ExportData {
  settings: Settings
  data: any
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
  originData?: string;
  graphs: Graph[];
  parameters: any;
}

export interface Graph {
  id: number;
  name: string;
  parameters: any;
  parentBlockID: number;
}
