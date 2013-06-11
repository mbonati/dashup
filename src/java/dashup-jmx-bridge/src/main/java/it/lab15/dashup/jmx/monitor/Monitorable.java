package it.lab15.dashup.jmx.monitor;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Monitorable {
	String type();
}
