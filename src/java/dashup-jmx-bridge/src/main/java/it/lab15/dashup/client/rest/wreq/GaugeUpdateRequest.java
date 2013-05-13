package it.lab15.dashup.client.rest.wreq;

import net.sf.json.JSONObject;

public class GaugeUpdateRequest extends BaseUpdateRESTRequest {
	
	private int value;
	
	public GaugeUpdateRequest(String widgetId) {
		super(widgetId);
	}

	public JSONObject toJSON() {
		JSONObject ret = super.toJSON();
		ret.put("value", this.value);
		return ret;
	}

	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	


}
