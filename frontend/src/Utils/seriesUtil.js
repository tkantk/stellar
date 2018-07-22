import * as STELLAR_CONST from '../Constants/StellarConstant';

const getCountSeries = (response, xAxis, filter, projects, priority) => {
    let series = [];
    for (let i=0; i < projects.length; i++) {
      let name = projects[i];
      let data = [];
      for (let h = 0; h < xAxis.categories.length; h++) {
        let monthYear = xAxis.categories[h];
        let count = 0;
        for(let j=0;j<response.Metrics.length;j++) {
          let obj = response.Metrics[j];
          if (obj.Account === name) {
            let resolvedOn = new Date(obj[filter]);
            let resolvedOnMonth = STELLAR_CONST.MONTH_INTERVAL[resolvedOn.getMonth()];
            let resolvedYear = resolvedOn.getFullYear();
            let resolvedObj = resolvedOnMonth+" - "+resolvedYear;
            if (resolvedObj === monthYear && (priority === "0" || obj.Priority === priority)) {
              count++;
            }
          }
        }
        data.push(count);
      }
      let seriesData = {
        "name": name,
        "data": data
      };
      series.push(seriesData);
    }
    return series;
}

const getLineSeries = (response, xAxis, project) => {
  let series = [];
  let resolvedData = [];
  let createdData = [];
  for (let h = 0; h < xAxis.categories.length; h++) {
    let monthYear = xAxis.categories[h];
    let resolvedCount = 0;
    let createdCount = 0;
    for(let j=0;j<response.Metrics.length;j++) {
      let obj = response.Metrics[j];
      if (obj.Account === project) {
        let resolvedOn = new Date(obj[STELLAR_CONST.RESOLVED_ON]);
        let resolvedOnMonth = STELLAR_CONST.MONTH_INTERVAL[resolvedOn.getMonth()];
        let resolvedYear = resolvedOn.getFullYear();
        let resolvedObj = resolvedOnMonth+" - "+resolvedYear;
        if ((resolvedObj === monthYear)) {
          resolvedCount++;
        }
        let createdOn = new Date(obj[STELLAR_CONST.CREATED_ON]);
        let createdOnMonth = STELLAR_CONST.MONTH_INTERVAL[createdOn.getMonth()];
        let createdOnYear = createdOn.getFullYear();
        let createdOnObj = createdOnMonth+" - "+createdOnYear;
        if ((createdOnObj === monthYear)) {
          createdCount++;
        }
      }
    }
    resolvedData.push(resolvedCount);
    createdData.push(createdCount);
  }
  let resolvedSeriesData = {
    "name": STELLAR_CONST.RESOLVED_ON,
    "data": resolvedData
  };
  series.push(resolvedSeriesData);
  let createdOnSeriesData = {
    "name": STELLAR_CONST.CREATED_ON,
    "data": createdData
  };
  series.push(createdOnSeriesData);
  return series;
}

const getAvgSeries = (response, xAxis, filter, projects, priority) => {
    let series = [];
    for (let i=0; i < projects.length; i++) {
      let name = projects[i];
      let data = [];
      for (let h = 0; h < xAxis.categories.length; h++) {
        let monthYear = xAxis.categories[h];
        let count = 0;
        let totalValue = 0;
        for(let j=0;j<response.Metrics.length;j++) {
          let obj = response.Metrics[j];
          if (obj.Account === name) {
            let resolvedOn = new Date(obj[filter]);
            let resolvedOnMonth = STELLAR_CONST.MONTH_INTERVAL[resolvedOn.getMonth()];
            let resolvedYear = resolvedOn.getFullYear();
            let resolvedObj = resolvedOnMonth+" - "+resolvedYear;
            if (resolvedObj === monthYear  && (priority === "0" || obj.Priority === priority)) {
              count++;
              totalValue += obj["Resolution Efforts"];
            }
          }
        }
        data.push(totalValue/count);
      }
      let seriesData = {
        "name": name,
        "data": data
      };
      series.push(seriesData);
    }
    return series;
}

const getXAxis = (response, filter) => {
    let xAxixObj = {};
    let categories = [];
    let responseArray = response.Metrics;
    if (filter === STELLAR_CONST.RESOLVED_ON) {
        responseArray.sort(date_sort_Resolved_asc);
    } else if (filter === STELLAR_CONST.CREATED_ON) {
        responseArray.sort(date_sort_Created_asc);
    }
    for (let i = 0; i < responseArray.length; i++) {
     let resolvedOn = new Date(responseArray[i][filter]);
     let resolvedOnMonth = STELLAR_CONST.MONTH_INTERVAL[resolvedOn.getMonth()];
     let resolvedYear = resolvedOn.getFullYear();
     let categoryObj = resolvedOnMonth+" - "+resolvedYear;
     if (categories.indexOf(categoryObj) === -1) {
       categories.push(categoryObj);
     }
    }
    xAxixObj = {
      "categories": categories,
      "crosshair": true
    };
    return xAxixObj;
    }

const date_sort_Resolved_asc = (obj1, obj2) => {
    let obj1Date = new Date(obj1[STELLAR_CONST.RESOLVED_ON]);
    let obj2Date = new Date(obj2[STELLAR_CONST.RESOLVED_ON]);
    if (obj1Date > obj2Date) return 1;
    if (obj1Date < obj2Date) return -1;
    return 0;
};

const date_sort_Created_asc = (obj1, obj2) => {
    let obj1Date = new Date(obj1[STELLAR_CONST.CREATED_ON]);
    let obj2Date = new Date(obj2[STELLAR_CONST.CREATED_ON]);
    if (obj1Date > obj2Date) return 1;
    if (obj1Date < obj2Date) return -1;
    return 0;
};

export {
    getCountSeries,
    getAvgSeries,
    getXAxis,
    getLineSeries,
};