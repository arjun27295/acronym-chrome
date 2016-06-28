var remoteServer='http://cds-myonlinesites.rhcloud.com/acronym?q=';

document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('#search').addEventListener('click', handleButtonQuery);
      document.querySelector('#create').addEventListener('click', redirectToParent);      
});

function redirectToParent()
{
	var newURL = "http://acronyms.silmaril.ie";
    chrome.tabs.create({ url: newURL });
}

function handleButtonQuery()
{
	queryRemote(document.getElementById("query").value);
}

function handleContextSearch(word,tab)
{
	console.log('Click Handler');
	console.log(word);
	if(e.selectionText)
	{
		queryRemote(word.selectionText);
	}	
}

function queryRemote(query)
{
	// var query=document.getElementById("query").value;
	var url=remoteServer+query;
	// var url='http://localhost:8080?q='+query;
	var xhr = new XMLHttpRequest();

	console.log(url);
	xhr.open("GET", url, true);
	xhr.send(null);
	
	document.getElementById("result").innerHTML="loading data from "+url;
	document.getElementById('result-data').innerHTML="";
	xhr.onreadystatechange = function() 
	{ 
		if(xhr.readyState == 4 && xhr.status == 200) 
	    {
	     
	        var res=JSON.parse(xhr.responseText);
	    	if(res.status)
	    	{
		        var x;
		        var resData=document.getElementById('result-data');
		        var html="";
		    	var n=res['n'];
		        // var n = res['data']['acronym']['found'][0]['$']['n'];
		        document.getElementById('result').innerHTML= "Found "+n+" result(s)";

		        if(n>0)
		        {
		        	for(x in res['data'])
		        	{
		        		html=html+"<li>"+res['data'][x]['Acronym']+" - "+res['data'][x]['Expansion']+"</li>";
		        	}
		        }
		    	
		    	// if(n>0)
		    	// {
		    	// 	for(x in res['data']['acronym']['found'][0]['acro'])
		    	// 	{
		    	// 		html=html+"<li>"+res['data']['acronym']['found'][0]['acro'][x]['expan'][0]+" - "+res['data']['acronym']['found'][0]['acro'][x]['comment'][0]+"</li>";
		    	// 	}
		    	// }
		    	document.getElementById('result-data').innerHTML=html;
	    	}
	    	else
			{
				document.getElementById('result').innerHTML= "Critical Problem";		
			}

	    }
	    if(xhr.readyState == 4 && xhr.status != 200)
	    {
	    	document.getElementById('result').innerHTML= "Network Problem";
	    }
	}
}