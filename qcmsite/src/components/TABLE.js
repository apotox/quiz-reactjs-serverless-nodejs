import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";



function TABLE({ caption, cols, data, perpage, gopage, total,gosearch = ()=>{} }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [searchQuery,setSearchQuery] = useState("")
  const _gopage = (page) => {
    console.log("go to ", page);
    setCurrentPage(page);
    gopage(page);
  };

  // const setSearchQuery = (query)=>{

  // }

  const debouncedFn =debounce(gosearch,2000)

  useEffect(()=>{

    debouncedFn(searchQuery)

  },[searchQuery])

  useEffect(() => {
    if (total == 0) {
      setPages([]);
    } else {
      console.log("currentPage", currentPage);

      let countPages =
        Math.floor(total / perpage) + (total % perpage == 0 ? 0 : 1);

      let after = Math.min(countPages - currentPage, 2);
      let before = Math.min(currentPage, 2);
      let tempPages = [];

      try {
        tempPages.push(
          new Array(before)
            .fill(0)
            .map((_, i) => {
              return (
                <div
                  className={`page-num `}
                  key={`before-${i}`}
                  onClick={() => _gopage(currentPage - i - 1)}
                >
                  {currentPage - i}
                </div>
              );
            })
            .reverse()
        );

        tempPages.push(
          <div className={`page-num page-current`}>
            {currentPage + 1} / {countPages}
          </div>
        );

        tempPages.push(
          new Array(after).fill(0).map((_, i) => {
            return (
              <div
                className={`page-num`}
                key={`after-${i}`}
                onClick={() => _gopage(currentPage + i + 1)}
              >
                {currentPage + i + 2}
              </div>
            );
          })
        );
      } catch (err) {
        //console.log("err",after,before,countPages , currentPage)
      }

      setPages(tempPages);
    }
  }, [total, currentPage]);

  const colType = (item, col) => {
    switch (col.type) {
      case "button":
        return (
          <Button
            style={col.style ? col.style(item) : {}}
            onClick={col.action(item)}
          >
            {col.label || item[col.name]}
          </Button>
        );
      case "link":
        return (
          <a
            style={col.style ? col.style(item) : {}}
            href={col.href ? col.href(item) : "#"}
          >
            {col.label || item[col.name]}
          </a>
        );
      case "custom":
        return (
          <div
            style={col.style ? col.style(item) : {}}
            className="custom-table-row"
          >
            {col.href(item) || ""}
          </div>
        );
      default:
        return (
          <span style={col.style ? col.style(item) : {}}>{item[col.name]}</span>
        );
    }
  };
  const Rows = ({ item }) => {
    return (
      <>
        {cols.map((col, index) => {
          return (
            <div className="item-row" key={`r-${item.id}-${index}`}>
              <span>{col.text}</span>
              <span>{colType(item, col)}</span>
            </div>
          );
        })}
      </>
    );
  };
  const Tds = ({ item }) => {
    return (
      <>
        {cols.map((col, index) => {
          return (
            <td
              id={`${col.name}-${item.id}`}
              key={`${col.name}-${item.id}-${index}`}
            >
              {colType(item, col)}
            </td>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <div className="search-bar">
        <InputGroup>
          <Input type="text" placeholder="Recherchez" onChange={e=>setSearchQuery(e.target.value)} />
          <InputGroupAddon addonType="append">
            <Button color="success" disabled={!searchQuery} onClick={e=>gosearch(searchQuery)}>
              <FaSearch />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <table className="my-table">
        <caption>{caption}</caption>
        
        { data && data.length > 0 ? <>
        <thead>
          <tr>
            {cols.map((col, index) => {
              return <th style={col.type=="custom" ? {width:80}:{}}  key={`${col.name}-${index}`}>{col.text}</th>;
            })}
          </tr>
        </thead>

        {data.map((item, index) => {
          return (
            <tr key={`tr-${item.id}-${index}`}>
              <Tds item={item} />
            </tr>
          );
        })}
        
        </> : <p className="no-data"> no data</p>}

        <tfoot>
          <tr>
            <td colSpan={cols.length}>
              <div className="paging">{pages}</div>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="my-table-mobile">
        <p className="caption" dangerouslySetInnerHTML={{ __html: caption }} />

        {data.map((item, index) => {
          return (
            <div className="item" key={`rows-of-${item.id}-${index}`}>
              <Rows item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TABLE;
