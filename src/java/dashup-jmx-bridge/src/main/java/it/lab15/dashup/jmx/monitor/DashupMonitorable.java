package it.lab15.dashup.jmx.monitor;

import javax.management.MBeanServerConnection;

import net.sf.json.JSONObject;

public interface DashupMonitorable {

	public void setup(MBeanServerConnection remote) throws Exception;

	public JSONObject toJSON();

}
