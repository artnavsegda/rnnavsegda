//
//  RCTBeaconModule.m
//  barenative
//
//  Created by Art Navsegda on 08.01.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "RCTBeaconModule.h"

@implementation RCTBeaconModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(doSomething:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)
{
  NSInteger eventId = 123;
  callback(@[@(eventId)]);
  RCTLogInfo(@"Pretending %@ at %@", title, location);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  return [[UIDevice currentDevice] name];
}

@end
