import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, firstValueFrom } from 'rxjs';
import { CampaignService } from '../../services/campaign.service';


export interface CampaignListItem {
  campaignID: number;
  startDate: string;
  endDate: string;
}

/**
 * Data source for the CampaignList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CampaignListDataSource extends DataSource<CampaignListItem> {
  data: CampaignListItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  loadingCampaigns$ = new BehaviorSubject<boolean>(false);
  deletingCampaign$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly campaignService: CampaignService
  ) {
    super();
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
        this.loadingCampaigns$,
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
    this.loadingCampaigns$.complete();
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
        case 'startDate': return compare(
          new Date(a.startDate).toISOString(),
          new Date(b.startDate).toISOString(),
          isAsc);
        case 'endDate': return compare(
          new Date(a.endDate).toISOString(),
          new Date(b.endDate).toISOString(),
          isAsc);
        default: return 0;
      }
    });
  }

  deleteCampaign(id: number) {

    // Update local data instead of requesting data again
    let index = this.data.findIndex((item) => item.campaignID === id);
    this.data.splice((index), 1);
    this.deletingCampaign$.next(true);
  }

  async loadCampaignData() {
    this.loadingCampaigns$.next(true);

    let campaignList: CampaignListItem[] =
      await firstValueFrom(this.campaignService.getAllCampaigns());

    campaignList.forEach((campaign) => {
      campaign.startDate = new Date(campaign.startDate).toLocaleDateString();
      campaign.endDate = new Date(campaign.endDate).toLocaleDateString();
    })
    this.data = campaignList;
    this.loadingCampaigns$.next(false);
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

