import * as React from "react";
//import styles from './SpAllProjects.module.scss';
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Grid,
  GridColumn as Column,
  GridDataStateChangeEvent,
  GridCellProps,
  GridItemChangeEvent,
  GridRowClickEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import "@progress/kendo-theme-material";
import "@progress/kendo-theme-material/dist/all.css";
import {
  AadHttpClient,
  HttpClientResponse,
  SPHttpClient,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import * as moment from "moment";
import { Button } from "@progress/kendo-react-buttons";
import { ISpBitbucketProps, ISpBitbucketState } from "./ISpBitbucketProps";
import { Checkbox } from "@progress/kendo-react-inputs";
import { bitBucketRepos } from "./Interfaces";
import { Renderers } from "./Renderers";

const sampleData: any = require("../../../data/sampleData.json");
const bitBucketRepos = sampleData["bitBucketRepos"];

const CustomLinkCell = props => {
  return (
    <td>
      <a href={props.dataItem.Link} target="_blank">{props.dataItem.Name}</a>
      {/* <a
        href={`https://someurl.com/id-${props.dataItem.ProductID}?name-${props.dataItem.ProductName}`}
        target="_blank"
      >
        {props.dataItem.ProductName}
      </a> */}
    </td>
  );
};

// function cloneProduct() {
//   return Object.assign({}, product);
// }

const cloneProduct = (data: bitBucketRepos) => ({ ...data });

let loadingPanel = (
  <div className="k-loading-mask">
    <span className="k-loading-text">Loading</span>
    <div className="k-loading-image"></div>
    <div className="k-loading-color"></div>
  </div>
);

class ButtonContainer extends React.Component {
  private button;
}

// interface AppState {
//   dataForGrid: Array<bitBucketRepos>;
//   editID: string | null;
// }

export default class KendoGrid extends React.Component<
  ISpBitbucketProps,
  ISpBitbucketState
> {
  public button: Button;
  public Renderers: Renderers;

  // state: AppState = {
  // dataForGrid: [...bitBucketRepos],
  // editID: null,
  constructor(props: ISpBitbucketProps) {
    super(props);
    this.state = {
      dataForGrid: [...bitBucketRepos],
      editID: null,
      editItem: undefined,
      changes: false,
      // items: [],
      // metaItems: [],
      // skip: 0,
      // take: 10,
      // totalRows: 0,
      // result: { data: [], total: 0, meta: [] },
      // expandedDetails: [],
      // collapsedGroups: [],
      // dataState: dataState,
      // myFlag: null
    };
    this.saveChanges = this.saveChanges.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.itemChange = this.itemChange.bind(this);

    this.Renderers = new Renderers(
      this.enterEdit.bind(this),
      this.exitEdit.bind(this),
      "inEdit"
    );
  }

  public render(): React.ReactElement<ISpBitbucketProps> {
    //const { items, skip, totalRows } = this.state;
    return (
      <React.Fragment>
        {this.noItemsCheck() === true && loadingPanel}
        <div>
          <div>
            {/* <div className="col-xs-12 col-sm-6 example-col">
              <h1>Bitbucket Repositories</h1>
            </div> */}
            <div
              className="col-xs-12 col-sm-6 example-col"
              style={{ display: "flex" }}
            >
              {/* <p>
                {/* <Button
                  primary={true}
                  //togglable={true}
                  onClick={() => this.forceUpdate()}
                  ref={(el) => (this.button = el)}
                >
                  {/* View {" "} {this.button && this.button.selected ? "All Projects" : "My Projects"} */}
              {/* </Button> */}
              {/* </p> */}
              <p style={{ marginLeft: "auto" }}>
                <Button icon="k-icon k-i-hyperlink-open-sm" primary={true}>
                  Create New Repository
                </Button>
              </p>
            </div>

            <Grid
              // data={this.state.dataForGrid.map((item) => ({
                // ...item,
                // inEdit: item.Name === this.state.editID,
              // }))}
              data={this.state.dataForGrid}
              style={{ height: "620px" }}
              //={DetailComponent}
              pageable
              groupable
              filterable
              resizable
              reorderable
              sortable
              editField="inEdit"
              onRowClick={this.rowClick}
              onItemChange={this.itemChange}
              cellRender={this.Renderers.cellRender}
              rowRender={this.Renderers.rowRender}
              //total={totalRows}
              //skip={skip}
              // take={dataState.take}
              //pageSize={this.props.pageSize}
              //data={newData}
              //onPageChange={this._onGridPageChange}
              //onDataStateChange={this.dataStateChange}
              //{...this.state.dataState}
              //expandField="expanded"
              //selectedField="selected"
              //onExpandChange={this.expandChange}
            >
              <GridToolbar>
                <button
                  title="Save Changes"
                  className="k-button"
                  onClick={this.saveChanges}
                  disabled={!this.state.changes}
                >
                  Save Changes
                </button>
                <button
                  title="Cancel Changes"
                  className="k-button"
                  onClick={this.cancelChanges}
                  disabled={!this.state.changes}
                >
                  Cancel Changes
                </button>
              </GridToolbar>
              <Column
                field="Name"
                title="Name"
                editable={false}
                cell={CustomLinkCell}
                // {(props: GridCellProps) => (
                //   <td>
                //     <a href={props.dataItem.Link}>{props.dataItem.Name}</a>
                //   </td>
                // )}
              />
              <Column field="Annotation" title="Annotation" />
              <Column
                field="IsFeatured"
                title="Is Featured"
                editor="boolean"
                cell={(props: GridCellProps) => (
                  <td>
                    <input
                      type="checkbox"
                      checked={props.dataItem[props.field || ""]}
                    />
                  </td>
                )}
              />
            </Grid>
          </div>
        </div>
      </React.Fragment>
    );
  }

  private enterEdit(dataItem, field) {
    if (dataItem.inEdit && field === this.state.editField) {
      return;
    }
    this.exitEdit();
    dataItem.inEdit = field;
    this.setState({
      editField: field,
      dataForGrid: this.state.dataForGrid,
    });
  }

  private exitEdit() {
    this.state.dataForGrid.forEach((d) => {
     // d.inEdit = undefined;
    });
    this.setState({
      dataForGrid: this.state.dataForGrid,
      editField: undefined,
    });
  }

  private saveChanges() {
    bitBucketRepos.splice(0, bitBucketRepos.length, ...this.state.dataForGrid);
    console.log(bitBucketRepos);
    this.setState({
      dataForGrid: bitBucketRepos.map(cloneProduct),
      editField: undefined,
      changes: false,
    });
    console.log(this.state);
  }

  private cancelChanges() {
    this.setState({
      dataForGrid: bitBucketRepos.map(cloneProduct),
      changes: false,
    });
  }

  private rowClick = (event: GridRowClickEvent) => {
    this.setState({
      editID: event.dataItem.Name,
    });
  }

  // itemChange = (event: GridItemChangeEvent) => {
  //   const field = event.field || "";
  //   const inEditID = event.dataItem.Name;
  //   const data = this.state.dataForGrid.map((item) =>
  //     item.Name === inEditID ? { ...item, [field]: event.value } : item
  //   );
  //   this.setState({ dataForGrid: this.state.dataForGrid });
  // };

  private itemChange(event) {
    event.dataItem[event.field] = event.value;
    this.setState({
      changes: true,
    });
  }

  private closeEdit = (event) => {
    if (event.target === event.currentTarget) {
      this.setState({ editID: null });
    }
  }
  // private dataStateChange = (event: GridDataStateChangeEvent) => {
  //   this._loadItems(this.state.skip);
  //   this.setState({
  //     ...this.state,
  //     skip: event.dataState.skip,
  //     take: event.dataState.take,
  //     dataState: event.dataState,
  //     result: process(this.state.result.data, event.dataState),
  //   });
  // }

  private noItemsCheck() {
    let noItems = false;
    // if (this.state.items.length === 0) {
    //   noItems = true;
    // }
    // if (this.state.myFlag === false){
    //   loadingPanel = null;
    // }
    return noItems;
  }

  public componentDidMount() {
    // const { skip } = this.state;
    // this._loadItems(skip);
  }
}
