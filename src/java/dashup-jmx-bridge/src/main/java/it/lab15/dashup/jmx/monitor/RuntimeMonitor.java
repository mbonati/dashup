package it.lab15.dashup.jmx.monitor;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;

import javax.management.MBeanServerConnection;

import net.sf.json.JSONObject;

public class RuntimeMonitor implements DashupMonitorable {

	RuntimeMXBean runtimeBean;
	private MBeanServerConnection remote;
	
	
	public RuntimeMonitor(){
	}
	
	public void initialize(MBeanServerConnection remote) throws Exception {
		this.remote = remote;
		runtimeBean = ManagementFactory.newPlatformMXBeanProxy(remote,
				ManagementFactory.RUNTIME_MXBEAN_NAME, RuntimeMXBean.class);
	}

	@Override
	public JSONObject toJSON() {
		// TODO Auto-generated method stub
		return null;
	}

}
