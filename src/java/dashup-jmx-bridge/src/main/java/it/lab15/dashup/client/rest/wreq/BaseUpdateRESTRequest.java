package it.lab15.dashup.client.rest.wreq;

import it.lab15.dashup.client.rest.RESTRequest;
import net.sf.json.JSONObject;


public abstract class BaseUpdateRESTRequest implements RESTRequest {
	
	private String widgetId;
	
	public BaseUpdateRESTRequest(String widgetId){
		this.widgetId = widgetId;
	}

	public JSONObject toJSON() {
		JSONObject ret = new JSONObject();
		ret.put("wid", this.widgetId);
		return ret;
	}

}
