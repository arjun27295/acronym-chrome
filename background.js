var remoteServer = 'http://cds-myonlinesites.rhcloud.com/acronym?q=';

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Find in Acronyms";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  var sText = info.selectionText;
  
  chrome.notifications.create({
		type: "basic",
		iconUrl: "icon.png",
		title: "Acronym Finder",
		message: "Searching",
	});

  queryRemote(sText);

};

function queryRemote(query)
{
	// var query=document.getElementById("query").value;
	var url=remoteServer+query;
	var xhr = new XMLHttpRequest();

	console.log(url);
	xhr.open("GET", url, true);
	xhr.send(null);
	
	xhr.onreadystatechange = function() 
	{
		if(xhr.readyState == 4 && xhr.status == 200) 
	    {
			var res=JSON.parse(xhr.responseText);
	    	if(res.status)
	    	{
		        var x;
		        var n= res['n'];		      
		        // var n = res['data']['acronym']['found'][0]['$']['n'];
		    	var items=[];

		    	if(n>0)
		    	{
		    		for(x in res['data'])
		    		{
		    			items.push({ title: res['data'][x]['Acronym'], message:res['data'][x]['Expansion'] });
		    		}
		    		// for(x in res['data']['acronym']['found'][0]['acro'])
		    		// {
		    		// 	items.push({ title: res['data']['acronym']['found'][0]['acro'][x]['expan'][0], 
		    		// 		message: res['data']['acronym']['found'][0]['acro'][x]['comment'][0] });
		    		// }
		    	}		    	
			  	
			  	if(items.length > 0)
			  	{
				  	chrome.notifications.create({
				  		type: "list",
				  		iconUrl: "icon.png",
				  		title: "Acronym Finder",
				  		message: "Found "+n+" acronyms",
				  		items: items,
				  		isClickable: true
				  	});	
			  	}
			  	else
			  	{
			  		chrome.notifications.create({
				  		type: "basic",
				  		iconUrl: "icon.png",
				  		title: "Acronym Finder",
				  		message: "No acronyms Found",
				  	});
			  	}
	    	}
	    	else
			{	
				chrome.notifications.create({
			  		type: "basic",
			  		iconUrl: "icon.png",
			  		title: "Acronym Finder",
			  		message: "Network Problem",
			  	});		
			}

	    }
	    if(xhr.readyState == 4 && xhr.status != 200)
	    {
	    	chrome.notifications.create({
			  		type: "basic",
			  		iconUrl: "icon.png",
			  		title: "Acronym Finder",
			  		message: "Network Problem",
			  	});
	    }
	}
}