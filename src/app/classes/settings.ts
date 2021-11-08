import {DataFrame, IDataFrame} from "data-forge";

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
  extra?: any;
}

export interface Graph {
  id: number;
  name: string;
  parameters: any;
  parentBlockID: number;
}

export class CurtainSettings {
  rawFile: string = ""
  processedFile: string = ""
  selectedIDs: any = {}
  annotatedIDs: any[] = []
  uniprot: boolean = false
  dbString: boolean = false
  antilogP: boolean = false
  fileSavedOnSever: boolean = false
  sampleLables: any = {}
  fileIsLink: boolean = false
  description: string = ""
  dataColumns: GraphData = new GraphData()
}

export class GraphData {
  raw: IDataFrame = new DataFrame()
  processed: IDataFrame = new DataFrame()
  rawIdentifierCol: string = ""
  rawSamplesCol: string[] = []
  processedIdentifierCol: string = ""
  processedLog2FC: string = ""
  processedPValue: string = ""
  processedCompLabel: string = ""
  uniprotMap: Map<string, any> = new Map<string, any>()
}
