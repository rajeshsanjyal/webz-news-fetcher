export class WebzQueryBuilder {
    private queryParams: URLSearchParams;
  
    constructor(private token: string) {
      this.queryParams = new URLSearchParams();
      this.queryParams.set('token', this.token);
      this.queryParams.set('size', '200');  // Default size
    }
  
    setQuery(query: string): this {
      this.queryParams.set('q', query);
      return this;
    }
  
    setSize(size: number): this {
      this.queryParams.set('size', size.toString());
      return this;
    }
  
    setNext(next: string): this {
      this.queryParams.set('next', next);
      return this;
    }
  
    setSortBy(sort: string): this {
      this.queryParams.set('sort', sort);
      return this;
    }
  
    setDateRange(startDate: string, endDate: string): this {
      this.queryParams.set('date', `${startDate} TO ${endDate}`);
      return this;
    }
  
    build(): string {
        return `https://api.webz.io/newsApiLite?${this.queryParams.toString()}`;
    }
  }
  