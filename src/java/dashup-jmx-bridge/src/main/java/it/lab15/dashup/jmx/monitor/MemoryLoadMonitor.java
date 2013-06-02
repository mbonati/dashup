package it.lab15.dashup.jmx.monitor;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

import javax.management.MBeanServerConnection;

import net.sf.json.JSONObject;

public class MemoryLoadMonitor implements DashupMonitorable {

	private MBeanServerConnection remote;
	private MemoryMXBean memBean;
	private JSONObject json = new JSONObject();

	public MemoryLoadMonitor() {
	}

	public void initialize(MBeanServerConnection remote) throws Exception {
		this.remote = remote;
		memBean = ManagementFactory.newPlatformMXBeanProxy(remote,
				ManagementFactory.MEMORY_MXBEAN_NAME, MemoryMXBean.class);
	}

	public long getHeapCommitted() {
		return getHeapUsage().getCommitted();
	}

	public long getHeapInit() {
		return getHeapUsage().getInit();
	}

	public long getHeapUsed() {
		return getHeapUsage().getUsed();
	}

	public long getHeapMax() {
		return getHeapUsage().getMax();
	}

	public MemoryUsage getHeapUsage() {
		return memBean.getHeapMemoryUsage();
	}

	public long getNonHeapCommitted() {
		return getNonHeapUsage().getCommitted();
	}

	public long getNonHeapInit() {
		return getNonHeapUsage().getInit();
	}

	public long getNonHeapUsed() {
		return getNonHeapUsage().getUsed();
	}

	public long getNonHeapMax() {
		return getNonHeapUsage().getMax();
	}

	public MemoryUsage getNonHeapUsage() {
		return memBean.getNonHeapMemoryUsage();
	}

	@Override
	public JSONObject toJSON() {
		json.put("getHeapCommitted",getHeapCommitted());
		json.put("getHeapInit",getHeapInit());
		json.put("getHeapUsed",getHeapUsed());
		json.put("getHeapMax",getHeapMax());
		json.put("getNonHeapCommitted",getNonHeapCommitted());
		json.put("getNonHeapInit",getNonHeapInit());
		json.put("getNonHeapUsed",getNonHeapUsed());
		json.put("getNonHeapMax",getNonHeapMax());
		json.put("getNonHeapUsage",getNonHeapUsage());
		return json;
	}
}
