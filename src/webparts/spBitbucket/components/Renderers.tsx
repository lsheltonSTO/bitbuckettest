import { GridCellProps } from '@progress/kendo-react-grid';
import bitBucketRepos from './SpBitbucket';
import * as React from 'react';

export class Renderers {
    private enterEdit: (dataItem: bitBucketRepos, field: string | undefined) => {};
    private exitEdit: () => {};
    public editFieldName: string;
    public preventExit: boolean | undefined;
    public preventExitTimeout: any;
    public blurTimeout: any;
    constructor(enterEdit, exitEdit, editFieldName) {
        this.enterEdit = enterEdit;
        this.exitEdit = exitEdit;
        this.editFieldName = editFieldName;

        this.cellRender = this.cellRender.bind(this);
        this.rowRender = this.rowRender.bind(this);
    }

    public cellRender = (tdElement: React.ReactElement<HTMLTableCellElement>, cellProps: GridCellProps) => {
        // const dataItem = cellProps.dataItem;
        const dataItem: bitBucketRepos = cellProps.dataItem;
        const cellField: string  = cellProps.field || '';
        const inEditField = dataItem[this.editFieldName];
        //const additionalProps = cellField && cellField === inEditField ?
        const additionalProps = (cellProps.dataItem[this.editFieldName] && (cellProps.field === cellProps.dataItem[this.editFieldName])) ?            {
                ref: (td: HTMLTableCellElement) => {
                    const input = td && td.querySelector('input');
                    const activeElement = document.activeElement;

                    if (!input ||
                        !activeElement ||
                        input === activeElement ||
                        !activeElement.contains(input)) {
                        return;
                    }
                    //if (!input || (input === document.activeElement)) { return; }

                    if (input.type === 'checkbox') {
                        input.focus();
                    } else {
                        input.select();
                    }
                }
            } : {
                onClick: () => { this.enterEdit(dataItem, cellField); },
                onKeyDown: (e) => {
                    if(e.keyCode === 13){
                        this.enterEdit(dataItem, cellField);
                    }
                }
            };
        return React.cloneElement(tdElement, { ...tdElement.props, ...additionalProps }, tdElement.props.children);
    }

    public rowRender = (trElement: React.ReactElement<HTMLTableRowElement>) => {
        const trProps = {
            ...trElement.props,
            onMouseDown: () => {
                this.preventExit = true;
                clearTimeout(this.preventExitTimeout);
                this.preventExitTimeout = setTimeout(() => { this.preventExit = undefined; });
            },
            onBlur: () => {
                clearTimeout(this.blurTimeout);
                if (!this.preventExit) {
                    this.blurTimeout = setTimeout(() => { this.exitEdit(); });
                }
            },
            onFocus: () => { clearTimeout(this.blurTimeout); }
        };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    }
}
