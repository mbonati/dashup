package it.lab15.dashup.jmx.core;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import it.lab15.dashup.jmx.common.JmxUtils;

import javax.management.MBeanServerConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JmxConnector {

	private static final Logger LOG = LoggerFactory.getLogger(JmxConnector.class);

	String jmxHost;
	int jmxPort;
	boolean autoReconnect;
	private JmxConnectorListener listener;
	private MBeanServerConnection jmxRemoteConnection;
	private long autoReconnectDelay = 3000;
	private Timer connectionProbeTimer;
	
	public long getAutoReconnectDelay() {
		return autoReconnectDelay;
	}

	public void setAutoReconnectDelay(long autoReconnectDelay) {
		this.autoReconnectDelay = autoReconnectDelay;
	}

	public JmxConnector(String jmxHost, int jmxPort, boolean autoReconnect, JmxConnectorListener listener){
		this.jmxHost = jmxHost;
		this.jmxPort = jmxPort;
		this.autoReconnect = autoReconnect;
		this.listener = listener;
	}
	
	public void start(){
		LOG.debug("start called...");
		doConnect();
	}
	
	
	private MBeanServerConnection doConnect() {
		try {
			jmxRemoteConnection = JmxUtils.getRemoteConnection(jmxHost, jmxPort);
			LOG.info("Connected to {}:{}", this.jmxHost, this.jmxPort);
			listener.onJmxConnection(jmxRemoteConnection);
			startConnectionProbe();
			return jmxRemoteConnection;
		} catch (Exception ex){
			LOG.error("Error : {}", ex.getMessage());
			startReconnectionTask();
		}
		return null;
	}
	
	private Timer reconnectionTimer;
	
	private void startReconnectionTask() {
		if (reconnectionTimer!=null){
			reconnectionTimer.cancel();
			reconnectionTimer = null;
		}
		stopConnectionProbe();
		TimerTask reconnectionTask = new TimerTask() {
			@Override
			public void run() {
				LOG.info("Trying to reconnect to {}:{}....", jmxHost, jmxPort);
				doConnect();
			}
		};
		reconnectionTimer = new Timer("ReconnectionTimer");
		reconnectionTimer.schedule(reconnectionTask, autoReconnectDelay);
	}
	
	private void startConnectionProbe(){
		LOG.trace("Starting connection probe...");
		TimerTask connectionProbeTask = new TimerTask() {
			@Override
			public void run() {
				LOG.trace("Connection probe...");
				if (jmxRemoteConnection!=null){
					try {
						jmxRemoteConnection.getMBeanCount();
					} catch (IOException e) {
						LOG.error("Connection probe error: {}", e.getMessage());
						listener.onJmxDisconnection(jmxRemoteConnection);
						startReconnectionTask();
					}
				} else {
					//TODO!!
				}
			}
		};
		connectionProbeTimer = new Timer();
		connectionProbeTimer.scheduleAtFixedRate(connectionProbeTask, 5000, 5000);
	}
	
	private void stopConnectionProbe(){
		if (connectionProbeTimer!=null){
			try {
				connectionProbeTimer.cancel();
			} catch (Exception ex){
			}
			connectionProbeTimer = null;
		}
	}

	public MBeanServerConnection getJmxRemoteConnection(){
		return this.jmxRemoteConnection;
	}
	
	public String getJmxHost() {
		return jmxHost;
	}

	public int getJmxPort() {
		return jmxPort;
	}

	public boolean isAutoReconnect() {
		return autoReconnect;
	}
	
	public interface JmxConnectorListener {
		public void onJmxConnection(MBeanServerConnection connection);
		public void onJmxDisconnection(MBeanServerConnection connection);
	}
	

	
}
