package it.lab15.dashup.jmx.sample;

import it.lab15.dashup.client.rest.RESTClient;
import it.lab15.dashup.client.rest.wreq.GaugeUpdateRequest;
import it.lab15.dashup.client.rest.wreq.TextUpdateRequest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class TimeRestClient extends Thread {

	RESTClient restClient;
	private String url;
	private SimpleDateFormat dateFormat = new SimpleDateFormat("hh:mm.ss");
	
	public TimeRestClient(String url){
		this.url = url;
	}
	
	public void run(){
		TextUpdateRequest textUpdate = new TextUpdateRequest("text.simpleExample");
		GaugeUpdateRequest gaugeUpdate = new GaugeUpdateRequest("gauge.simpleExample");
		
		Random rnd = new Random();
		
		try {
			restClient = new RESTClient();
			restClient.connect(url);
			while(true){
				textUpdate.setText(dateFormat.format(new Date()));
				restClient.update(textUpdate);

				gaugeUpdate.setValue(rnd.nextInt(100));
				restClient.update(gaugeUpdate);

				sleep(3000);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		new TimeRestClient("http://localhost:5000").start();
	}

}
