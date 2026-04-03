import * as React from "react";
import * as PropTypes from "prop-types";
import {
  SearchData,
  NavigateContext,
  Router as RouterType
} from "../interfaces";

export interface SearchProps extends SearchData, React.HTMLProps<Search> {
  fetchSearchDescription?: (url: string) => void;
  allLanguageSearch?: boolean;
  router?: any; // Optional router prop for navigation
  pathFor?: (collectionUrl?: string | null, bookUrl?: string | null) => string; // Optional pathFor prop
}

/** Search box. */
export default class Search extends React.Component<SearchProps, {}> {
  context: NavigateContext;

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object as React.Validator<RouterType>,
    pathFor: PropTypes.func
  };

  render(): JSX.Element {
    console.log("[OPDS Search] render", {
      searchData: this.props.searchData,
      props: this.props
    });
    return (
      <div className="search" role="search">
        {this.props.searchData && (
          <form
            onSubmit={this.onSubmit}
            className={this.props.className || "form-inline"}
          >
            <input
              className="form-control"
              ref="input"
              aria-label="Enter search keyword or keywords"
              type="text"
              name="search"
              title={this.props.searchData.shortName}
              placeholder={this.props.searchData.shortName}
            />
            &nbsp;
            <button className="btn btn btn-default" type="submit">
              Search
            </button>
          </form>
        )}
      </div>
    );
  }

  componentWillMount() {
    if (this.props.url) {
      this.props.fetchSearchDescription?.(this.props.url);
    }
  }

  componentWillUpdate(props) {
    if (props.url && props.url !== this.props.url) {
      props.fetchSearchDescription(props.url);
    }
  }

  onSubmit(event) {
    console.log("[OPDS Search] onSubmit fired", {
      searchData: this.props.searchData,
      refs: this.refs
    });
    let searchTerms = encodeURIComponent(this.refs["input"]["value"]);
    let url = this.props.searchData?.template?.(searchTerms);
    if (this.props.allLanguageSearch) {
      url += "&language=all";
    }
    console.log("[OPDS Search] Built URL:", url);
    // Prefer props.router and props.pathFor if provided, else fallback to context
    const router = this.props.router || this.context.router;
    const pathFor = this.props.pathFor || this.context.pathFor;
    if (router && pathFor) {
      router.push(pathFor(url, null));
    } else {
      console.warn("[OPDS Search] No router or pathFor available for navigation");
    }
    event.preventDefault();
  }
}
