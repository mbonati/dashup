package it.lab15.dashup.jmx.sample;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.util.Set;

import javax.management.MBeanServerConnection;
import javax.management.ObjectName;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import com.sun.management.OperatingSystemMXBean;

import com.j256.simplejmx.client.JmxClient;

public class SimpleJMXClient {
	
	private static class Result {
		long upTime = -1L;
		long processCpuTime = -1L;
		float cpuUsage = 0;
		int nCPUs;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			
			

//			JmxClient client = new JmxClient(1234);
//
//			String remoteUrl = JmxClient.generalJmxUrlForHostNamePort(
//					"localhost", 1234);
//			System.out.println("Connecting to " + remoteUrl + "...");
//			JMXServiceURL serviceURL = new JMXServiceURL(remoteUrl);
//			JMXConnector connector = JMXConnectorFactory.connect(serviceURL);
//			MBeanServerConnection remote = connector.getMBeanServerConnection();
//
//			com.sun.management.OperatingSystemMXBean remoteBean = ManagementFactory
//					.newPlatformMXBeanProxy(remote,
//							ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME,
//							com.sun.management.OperatingSystemMXBean.class);
//
//			System.out.println(remoteBean.getName());
//			System.out.println(remoteBean.getProcessCpuTime());
//			System.out.println(remoteBean.getProcessCpuLoad());
//			System.out.println(remoteBean.getObjectName().getCanonicalName());


			// // get the set of bean names exported by the JVM
			// Set<ObjectName> objectNameSet = client.getBeanNames();
			// for (ObjectName objName:objectNameSet){
			// System.out.println(objName.getDomain()+ " " +
			// objName.getCanonicalName() + "");
			// }
			// // get the start-time in milliseconds
			// long startTimeMillis = (Long)client.getAttribute(new
			// ObjectName("java.lang:type=Runtime"), "StartTime");
			// // run garbage collection
			// client.invokeOperation(new ObjectName("java.lang:type=Memory"),
			// "gc");

		} catch (Exception ex) {
			ex.printStackTrace();
		}

	}
}
