export class Settings {
  starterFileColumns: string[] = []
  experiments: Experiment[] = []
}

export interface Experiment {
  name: string;
  condition: string;
}
