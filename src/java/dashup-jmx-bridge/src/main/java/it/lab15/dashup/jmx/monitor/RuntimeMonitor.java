package it.lab15.dashup.jmx.monitor;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;

import javax.management.MBeanServerConnection;

import net.sf.json.JSONObject;

@Monitorable(type="Runtime")
public class RuntimeMonitor implements DashupMonitorable {

	RuntimeMXBean runtimeBean;
	private MBeanServerConnection remote;
	private String id;
	
	public RuntimeMonitor(){
	}
	
	@Override
	public void setup(MBeanServerConnection remote) throws Exception {
		this.remote = remote;
		runtimeBean = ManagementFactory.newPlatformMXBeanProxy(remote,
				ManagementFactory.RUNTIME_MXBEAN_NAME, RuntimeMXBean.class);
	}

	@Override
	public JSONObject toJSON() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getId() {
		return this.id;
	}

	@Override
	public void setId(String id) {
		this.id = id;
	}

}
