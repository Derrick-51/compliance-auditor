import { Inject } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { CampaignListDataSource, CampaignListItem } from './campaign-list-datasource';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DialogData {
  campaignID: number;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AuditorNavbarComponent,
    MatButtonModule
  ]
})
export class CampaignListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CampaignListItem>;
  dataSource = new CampaignListDataSource();
  campaignForDeleteID!: number;

  constructor(
    public dialog: MatDialog,
    private router: Router
    ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['campaignID', 'startDate', 'endDate', 'actions'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(CampaignDeleteDialog, {
      data: {campaignID: id},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteCampaign(result);
      }
    })
  }


  deleteCampaign(id: number) {
    this.dataSource.deleteCampaign(id)
  }

  goToCampaign(id: string): void {
    const navigationDetails: string[] = ['campaign'];

    // Function call always sends number instead of string
    id = `${id}`;

    // Only add parameter if it exists
    if(id.length) {
      navigationDetails.push(`${id}`);
    }

    this.router.navigate(navigationDetails);
  }
}

@Component({
  selector: 'campaign-delete-dialog',
  templateUrl: 'campaign-delete-dialog.html',
  styleUrl: 'campaign-delete-dialog.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class CampaignDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<CampaignDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
