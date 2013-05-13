package it.lab15.dashup.client.rest;

import it.lab15.dashup.client.rest.wreq.BaseUpdateRESTRequest;

import java.util.concurrent.Future;

import net.sf.json.JSONObject;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClient.BoundRequestBuilder;
import com.ning.http.client.Response;

public class RESTClient {

	private String daushupUrl;
	private AsyncHttpClient asyncHttpClient;

	public RESTClient() {
	}

	public String getUrl() {
		return this.daushupUrl;
	}

	public void connect(String url) throws Exception {
		if (isConnected()) {
			throw new Exception("Already conencted.");
		} else {
			this.daushupUrl = url;
			asyncHttpClient = new AsyncHttpClient();
		}
	}

	public void disconnect() {
		if (asyncHttpClient != null) {
			asyncHttpClient.close();
			asyncHttpClient = null;
		}
	}

	public boolean isConnected() {
		if (asyncHttpClient == null) {
			return false;
		} else {
			return !asyncHttpClient.isClosed();
		}
	}

	private Reply sendRequest(String urlMethod, RESTRequest request) throws Exception {
		BoundRequestBuilder brb = asyncHttpClient.preparePost(daushupUrl+"/"+urlMethod);
		brb.addHeader("Content-Type", "application/json");
		brb.setBody(request.toJSON().toString());
		Future<Response> f = brb.execute();
		Response r = f.get();
		JSONObject reply = JSONObject.fromObject(r.getResponseBody());
		return new Reply(reply);
	}

	public Reply update(BaseUpdateRESTRequest request) throws Exception {
		return sendRequest("updateValue", request);
	}
	
	
}
