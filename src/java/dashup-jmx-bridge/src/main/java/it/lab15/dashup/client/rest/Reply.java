package it.lab15.dashup.client.rest;

import net.sf.json.JSONObject;

public class Reply {

	JSONObject jsonReply;
	
	public Reply(JSONObject reply){
		this.jsonReply = reply;
	}
	
	public String getResult(){
		return jsonReply.getString("result");
	}

}
