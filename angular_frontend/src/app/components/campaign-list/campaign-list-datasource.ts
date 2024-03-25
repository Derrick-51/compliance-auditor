import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

// TODO: Replace this with your own data model type
export interface CampaignListItem {
  campaignID: number;
  startDate: string;
  endDate: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: CampaignListItem[] = [
  {campaignID: 1, startDate: '2024-04-22', endDate: '2024-06-03'},
  {campaignID: 2, startDate: '2024-07-10', endDate: '2025-03-18'},
  {campaignID: 3, startDate: '2025-04-27', endDate: '2025-12-26'},
  {campaignID: 4, startDate: '2026-06-01', endDate: '2026-07-01'},
  {campaignID: 5, startDate: '2026-09-14', endDate: '2027-03-29'},
  {campaignID: 6, startDate: '2027-08-20', endDate: '2027-08-25'},
  {campaignID: 7, startDate: '2028-04-19', endDate: '2028-11-07'},
  {campaignID: 8, startDate: '2029-01-05', endDate: '2029-02-06'},
  {campaignID: 9, startDate: '2029-02-27', endDate: '2029-03-12'},
  {campaignID: 10, startDate: '2029-10-18', endDate: '2030-07-22'},
  {campaignID: 11, startDate: '2031-01-15', endDate: '2031-05-23'},
  {campaignID: 12, startDate: '2031-06-05', endDate: '2031-09-17'},
  {campaignID: 13, startDate: '2031-10-17', endDate: '2031-12-14'},
  {campaignID: 14, startDate: '2032-07-26', endDate: '2032-12-14'},
  {campaignID: 15, startDate: '2032-12-26', endDate: '2033-02-12'},
  {campaignID: 16, startDate: '2033-04-11', endDate: '2033-05-13'},
  {campaignID: 17, startDate: '2033-06-08', endDate: '2034-02-08'},
  {campaignID: 18, startDate: '2034-04-08', endDate: '2034-04-28'},
  {campaignID: 19, startDate: '2035-03-06', endDate: '2035-08-03'},
  {campaignID: 20, startDate: '2036-03-02', endDate: '2036-12-02'},
];

/**
 * Data source for the CampaignList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CampaignListDataSource extends DataSource<CampaignListItem> {
  data: CampaignListItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  deletingCampaign$ = new BehaviorSubject<boolean>(false);

  constructor(data?: any) {
    super();
    console.log('constructor')
    if(data) {
      console.log('data present')
      this.data = data
    }
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<CampaignListItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange,
        this.deletingCampaign$
        ).pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.deletingCampaign$.complete();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: CampaignListItem[]): CampaignListItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: CampaignListItem[]): CampaignListItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'campaignID': return compare(a.campaignID, b.campaignID, isAsc);
        case 'startDate': return compare(+a.startDate, +b.startDate, !isAsc);
        case 'endDate': return compare(+a.endDate, +b.endDate, !isAsc);
        default: return 0;
      }
    });
  }

  deleteCampaign(id: number) {
    // Delete campaign in database using service

    // Update local data instead of requesting data again
    let index = this.data.findIndex((item) => item.campaignID === id);
    this.data.splice((index), 1);
    this.deletingCampaign$.next(true);
  }

  // getCampaignData(): CampaignListItem[] {

  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

