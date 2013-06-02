package it.lab15.dashup.jmx.monitor;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;

import javax.management.MBeanServerConnection;

import net.sf.json.JSONObject;

public class CPULoadMonitor implements DashupMonitorable {

	private long prevUpTime, prevProcessCpuTime;
	private MBeanServerConnection remote;
	private CPULoadInfo cpuLoadInfo;
	com.sun.management.OperatingSystemMXBean osBean;
	private RuntimeMXBean rmBean;

	public CPULoadMonitor() {
	}

	public void initialize(MBeanServerConnection remote) throws IOException{
		this.remote = remote;
		
		rmBean = ManagementFactory
				.newPlatformMXBeanProxy(remote,
						ManagementFactory.RUNTIME_MXBEAN_NAME,
						RuntimeMXBean.class);

		osBean = ManagementFactory
				.newPlatformMXBeanProxy(remote,
						ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME,
						com.sun.management.OperatingSystemMXBean.class);
		cpuLoadInfo = new CPULoadInfo(); 
		
		cpuLoadInfo.nCPUs = osBean.getAvailableProcessors();
		cpuLoadInfo.upTime = rmBean.getUptime();
		cpuLoadInfo.processCpuTime = osBean.getProcessCpuTime();
		
	}
	
	public float getCPULoad() throws Exception {
		if (cpuLoadInfo==null){
			throw new Exception("Not yet initialized.");
		}
		cpuLoadInfo.upTime = rmBean.getUptime();
		cpuLoadInfo.processCpuTime = osBean.getProcessCpuTime();
		if (cpuLoadInfo.upTime > 0L && cpuLoadInfo.processCpuTime >= 0L)
			updateCPUInfo();
		return cpuLoadInfo.cpuUsage;
	}

	public void updateCPUInfo() {
		if (prevUpTime > 0L && cpuLoadInfo.upTime > prevUpTime) {
			// elapsedCpu is in ns and elapsedTime is in ms.
			long elapsedCpu = cpuLoadInfo.processCpuTime - prevProcessCpuTime;
			long elapsedTime = cpuLoadInfo.upTime - prevUpTime;
			// cpuUsage could go higher than 100% because elapsedTime
			// and elapsedCpu are not fetched simultaneously. Limit to
			// 99% to avoid Plotter showing a scale from 0% to 200%.
			cpuLoadInfo.cpuUsage = Math.round(Math.min(100F, elapsedCpu
					/ (elapsedTime * 10000F * cpuLoadInfo.nCPUs)));
		}

		prevUpTime = cpuLoadInfo.upTime;
		prevProcessCpuTime = cpuLoadInfo.processCpuTime;
	}

	public CPULoadInfo getCPULoadInfo(){
		return cpuLoadInfo;
	}
	
	public static class CPULoadInfo {
		public long getUpTime() {
			return upTime;
		}
		public long getProcessCpuTime() {
			return processCpuTime;
		}
		public float getCpuUsage() {
			return cpuUsage;
		}
		public int getnCPUs() {
			return nCPUs;
		}
		public JSONObject toJSON(){
			json.put("upTime", upTime);
			json.put("processCpuTime", processCpuTime);
			json.put("cpuUsage", cpuUsage);
			json.put("nCPUs", nCPUs);
			return json ;
		}
		JSONObject json = new JSONObject();
		long upTime = -1L;
		long processCpuTime = -1L;
		float cpuUsage = 0;
		int nCPUs;
	}

	@Override
	public JSONObject toJSON() {
		return cpuLoadInfo.toJSON();
	}

}
