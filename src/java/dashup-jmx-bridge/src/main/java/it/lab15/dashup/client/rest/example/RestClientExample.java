package it.lab15.dashup.client.rest.example;

import it.lab15.dashup.client.rest.RESTClient;
import it.lab15.dashup.client.rest.wreq.GaugeUpdateRequest;
import it.lab15.dashup.client.rest.wreq.TextUpdateRequest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.Set;

import javax.management.ObjectName;

import com.j256.simplejmx.client.JmxClient;

public class RestClientExample extends Thread {

	RESTClient restClient;
	private String url;
	private SimpleDateFormat dateFormat = new SimpleDateFormat("hh:mm.ss");
	
	public RestClientExample(String url){
		this.url = url;
		testJMXClient();
	}
	
	private void testJMXClient() {
		try {
			int port = Integer.parseInt(System.getProperty("com.sun.management.jmxremote.port"));
			JmxClient client = new JmxClient(1234);
			// get the set of bean names exported by the JVM
			Set<ObjectName> objectNameSet = client.getBeanNames();
			for (ObjectName objName:objectNameSet){
				System.out.println(objName.getDomain()+ " " + objName.getCanonicalName() + ""); 
			}
			// get the start-time in milliseconds
			long startTimeMillis = (Long)client.getAttribute(new ObjectName("java.lang:type=Runtime"), "StartTime");
			// run garbage collection
			client.invokeOperation(new ObjectName("java.lang:type=Memory"), "gc");
		} catch (Exception ex){
			ex.printStackTrace();
		}
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
		new RestClientExample("http://localhost:5000").start();
	}

}
