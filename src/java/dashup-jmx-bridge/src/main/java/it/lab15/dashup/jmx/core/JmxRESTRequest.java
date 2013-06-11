package it.lab15.dashup.jmx.core;

import net.sf.json.JSONObject;
import it.lab15.dashup.client.rest.wreq.BaseUpdateRESTRequest;

public class JmxRESTRequest extends BaseUpdateRESTRequest {

	private JSONObject data;
	
	public JmxRESTRequest(String widgetId) {
		super(widgetId);
	}

	public void setJsonRequest(JSONObject data){
		this.data = data;
	}
	
	@Override
	public JSONObject toJSON() {
		JSONObject ret = super.toJSON();
		ret.putAll(data);
		return ret;
	}

	
}
