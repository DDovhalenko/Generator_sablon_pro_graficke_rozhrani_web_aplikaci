 #/* ********************************************************************************************************* *
 # *
 # * Copyright 2025 Oidis
 # *
 # * SPDX-License-Identifier: BSD-3-Clause
 # * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 # * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 # *
 # * ********************************************************************************************************* */

FROM oidis/oidis-builder-toolchain:latest
MAINTAINER Michal Kelnar "michal@oidis.io"

ARG OIDIS_STUDIO_PATH="/var/oidis/io-oidis-studio-gui"
ENV OIDIS_STUDIO_PATH ${OIDIS_STUDIO_PATH}

RUN mkdir -p ${OIDIS_STUDIO_PATH}

WORKDIR ${OIDIS_STUDIO_PATH}

COPY build.sh build.sh
RUN sed -i 's/\r//g' build.sh

RUN chmod +x build.sh

CMD ["./build.sh"]
