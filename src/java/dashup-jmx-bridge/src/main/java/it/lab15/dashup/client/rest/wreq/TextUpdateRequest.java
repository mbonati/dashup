package it.lab15.dashup.client.rest.wreq;

import net.sf.json.JSONObject;

public class TextUpdateRequest extends BaseUpdateRESTRequest {
	
	private String text;
	
	public TextUpdateRequest(String widgetId) {
		super(widgetId);
	}

	public JSONObject toJSON() {
		JSONObject ret = super.toJSON();
		ret.put("text", this.text);
		return ret;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	


}
