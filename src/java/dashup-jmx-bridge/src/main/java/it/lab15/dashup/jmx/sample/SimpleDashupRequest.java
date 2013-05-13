package it.lab15.dashup.jmx.sample;

import java.util.Date;
import java.util.concurrent.Future;

import net.sf.json.JSONObject;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClient.BoundRequestBuilder;
import com.ning.http.client.Response;

public class SimpleDashupRequest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		String DASHUP_UPDATE_URL = "http://localhost:5000/updateValue";

		try {
			AsyncHttpClient asyncHttpClient = new AsyncHttpClient();
			BoundRequestBuilder brb = asyncHttpClient.preparePost(DASHUP_UPDATE_URL);
			brb.addHeader("Content-Type", "application/json");

			JSONObject jsonRequest = new JSONObject();
			jsonRequest.put("wid", "text.simpleExample");
			jsonRequest.put("text", "Hello from Java!");
			brb.setBody(jsonRequest.toString());
			
			Future<Response> f = brb.execute();
			Response r = f.get();
			JSONObject reply = JSONObject.fromObject(r.getResponseBody());
			System.out.println("Result: " + reply.getString("result"));
			
			asyncHttpClient.close();
			
		} catch (Exception ex) {
			ex.printStackTrace();
		}

	}

}
