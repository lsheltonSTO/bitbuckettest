import bitBucketRepos from './SpBitbucket';

export interface ISpBitbucketProps {
 description: string;
}

export interface ISpBitbucketState {
  dataForGrid: Array<bitBucketRepos>;
  editID: number | null;
  editItem: any;
  changes: boolean;
  editField?: string;
  // changes: boolean,
}
