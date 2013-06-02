package it.lab15.dashup.jmx.common;

import java.io.IOException;
import java.net.MalformedURLException;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;

import com.j256.simplejmx.client.JmxClient;

public class JmxUtils {

	public static String buildServiceURL(String host, int port) {
		return JmxClient.generalJmxUrlForHostNamePort(host, port);
	}

	public static JMXServiceURL createServiceURL(String remoteUrl)
			throws MalformedURLException {
		return new JMXServiceURL(remoteUrl);
	}

	public static JMXServiceURL createServiceURL(String host, int port)
			throws MalformedURLException {
		return createServiceURL(buildServiceURL(host, port));
	}

	public static MBeanServerConnection getRemoteConnection(
			JMXServiceURL serviceURL) throws IOException {
		JMXConnector connector = JMXConnectorFactory.connect(serviceURL);
		return connector.getMBeanServerConnection();
	}

	public static MBeanServerConnection getRemoteConnection(String host, int port) throws IOException {
		return getRemoteConnection(createServiceURL(host, port));
	}
	

}
