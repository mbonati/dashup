package it.lab15.dashup.jmx.sample;

import java.util.Set;

import javax.management.ObjectName;

import com.j256.simplejmx.client.JmxClient;

public class SimpleJMXClient {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
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

}
