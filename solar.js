
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let today=new Date();
let DateString="20220830"

async function GetSolarToken(token) {
    let url = "https://portal.solaranalytics.com.au/api/v3/token"
    let params = {
        headers: {
            "Authorization": "Basic bG90dGVseW5uLnJlZGR5QGNsYXJlbmNlcHJvcGVydHkuY29tLmF1OkNoYWlyIzE0NDg="
        }
    }
    let response = await fetch(url, params);
    let data = await response.json();
    if (data.token != null)
        return data.token
    else
        return null;
}

async function GetSiteData(token) {
    let url = "https://portal.solaranalytics.com.au/api/v3/site_list?reseller=true&address=true&timezone=false&postcode=true&state=true&country=true&capacity=true&subscription=true&account=true&hardware=true"
    let params = {
        headers: {
            "Authorization": "Bearer " + token
        }
    }
    let response = await fetch(url, params);
    let data = await response.json();
    data = data.data;
    //console.log(data)
    let sites = await data.map(e => {
        return e.site_id
    }
    )
    return sites;
}

async function GetEnergyData(token, sites) {
    console.log(DateString);
    let temp=[];
    let params = {
        headers: {
            "Authorization": "Bearer " + token
        }
    }
    let promises=sites.map(async e => {
        let url = "https://portal.solaranalytics.com.au/api/v2/site_data/" + e + "?tstart=" + DateString + "&tend=" + DateString + "&gran=minute&raw=false&trunc=false"
        let response=await fetch(url,params)
        let data= await response.json()
        let obj={"site": e, "data":data.data}
        //console.log(obj)
        return obj
    })

    let energySummary=await Promise.all(promises)
    var result = energySummary.find( item => item.site === 274207);
    console.log(result)
}




async function GetSolarData() {
    let token = await GetSolarToken();
    if (token != null) {
        console.log(token);
        let sites = await GetSiteData(token);
        console.log(sites);
        if(sites.length>0)
            GetEnergyData(token,sites);
    }
}

GetSolarData();