import { Component, OnInit } from '@angular/core';

import { RecordService } from '../../../data/service/record.service';
import { Record } from '../../../data/schema/record';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { RecordNode } from '../../../data/schema/recordNode';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  records: Record[];

  expandedNodes: RecordNode[];

  treeControl = new FlatTreeControl<RecordNode>(
    node => node.level, node => node.expandable);

  treeFlattener;
  dataSource;

  constructor(
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => [...node.sections, ...node.items])
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.loadRecords();
  }

  private _transformer = (node: Record, level: number) => {
    const sections = node.sections ? node.sections : [];
    const items = node.items ? node.items : [];

    return {
      sections: sections,
      items: items,
      expandable: (sections.length + items.length) > 0,
      name: node.name,
      id: node.id,
      sale: node.sale,
      level: level,
      isLeaf: typeof node.sale !== 'undefined'
    };
  }

  loadRecords() {
    this.recordService.getAll().subscribe(records => {
      this.records = records
      this.dataSource.data = records
      this.recordService.saveRecords(records)
    })
  }

  /**
   * Remove selected node
   */
  remove(node: RecordNode) {
    this.recordService.removeRecord(node, this.records)
    // rebuild tree with mutated data
    this.rebuildTreeForData(this.records);
    this.recordService.saveRecords(this.records)
  }

  /**
   * Move selected node
   */
  move(id: string, move_up?: boolean) {
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

    // recursive find function to find siblings of node
    function findNodeSiblings(arr: Array<any>, node_id: string): Array<any> {
      let result, subResult;
      arr.forEach(node => {
        const sections = node.sections ? node.sections : [];
        const items = node.items ? node.items : [];
        if (node.id === node_id) {
          result = arr;
        } else {
          if (items.length) {
            subResult = findNodeSiblings(items, node_id);
            if (subResult) result = subResult;
          }
          if (sections.length) {
            subResult = findNodeSiblings(sections, node_id);
            if (subResult) result = subResult;
          }
        }
      });
      return result;
    }

    const siblings = findNodeSiblings(changedData, id);
    const siblingIndex = siblings.findIndex(n => n.id === id);
    const nodeToInsert: RecordNode = siblings.splice(siblingIndex, 1)[0];

    // determine where to insert the node
    if (move_up) {
      let insertIndex = siblingIndex - 1;
      if (insertIndex < 0) {
        insertIndex = siblings.length;
      }
      siblings.splice(insertIndex, 0, nodeToInsert);
    } else {
      let insertIndex = siblingIndex + 1;
      if (insertIndex > siblings.length) {
        insertIndex = siblings.length;
      }
      siblings.splice(insertIndex, 0, nodeToInsert);
    }

    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);
  }

  /**
   * Save expanded nodes before being rebuilt
   */
  saveExpandedNodes() {
    this.expandedNodes = new Array<RecordNode>();
    this.treeControl.dataNodes.forEach(node => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
  }

  /**
   * Restore expanded nodes after being rebuilt
   */
  restoreExpandedNodes() {
    this.expandedNodes.forEach(node => {
      const exp_node = this.treeControl.dataNodes.find(n => n.id === node.id);
      if (exp_node) {
        this.treeControl.expand(exp_node);
      }
    });
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */
  rebuildTreeForData(data: Record[]) {
    this.saveExpandedNodes();
    this.dataSource.data = data;
    this.restoreExpandedNodes();
  }

  hasChild = (_: number, node: RecordNode) => node.expandable;
}
